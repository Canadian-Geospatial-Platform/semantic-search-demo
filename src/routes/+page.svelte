<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import { onMount } from 'svelte';

    let query = '';
    let semanticSearchResult = {} as any;
    let keywordSearchResult = {} as any;
    let graphicOverview = [];

    async function handleSemanticSearch() {
        const semanticSearchResponse = await fetch(`https://search-recherche.geocore-dev.api.geo.ca/search-opensearch?method=SemanticSearch&searchString=${query}`);
        const semanticSearchData = await semanticSearchResponse.json();
        semanticSearchResult = semanticSearchData.body.response;  // Adjust this based on the actual structure of your returned JSON
        console.log(semanticSearchResult.items);
    }

    async function handleKeywordSearch() {
        const keywordSearchResponse = await fetch(`https://geocore-dev.api.geo.ca/geo?keyword=${query}&keyword_only=true&lang=en&min=1&max=10&sort=popularity-desc`);
        const keywordSearchData = await keywordSearchResponse.json();
        keywordSearchResult = keywordSearchData;
        console.log(keywordSearchData);
    }

    async function handleSearch() {
        handleKeywordSearch();
        handleSemanticSearch();
    }
</script>

<svelte:head>
    <title>Semantic Search API Demo for GEO.ca</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</svelte:head>

<main>
    <h1>Semantic Search API Demo</h1>
    <p>(for future GEO.ca)</p>
    <p>Please note that this current version queries our development servers and works only within NRCan/GoC network.</p>
    <p>Front-end demo v0.1.0 (2024-06-20), work-in-progress</p>

    <form id="searchForm">
        <input type="text" bind:value={query} placeholder="Enter search query" />
        <button type="submit" on:click={handleSearch}>Search</button>
    </form>

    <div class="flex-container">
    <div>
    <h2>Semantic search results</h2>
    {#if semanticSearchResult.total_hits > 0}
        <ul>
            {#each semanticSearchResult.items as item (item.features[0].properties.row_num)}
                <li>
                    {#if item.features[0].properties.graphicOverview[0] && item.features[0].properties.graphicOverview[0].overviewFileName}
                        <img src={item.features[0].properties.graphicOverview[0].overviewFileName} alt="Preview thumbnail of {item.features[0].properties.title}" class="graphicOverview" />
                    {/if}
                    <a href={"https://app-dev.geo.ca/result/en/" + item.features[0].properties.title.replace(/\W+/g, '-').toLowerCase() + "?id=" + item.features[0].properties.id + "&lang=en"} target="_blank">
                        <h3>{item.features[0].properties.row_num}. {item.features[0].properties.title}</h3>
                    </a>
                    <div class="small">
                        <p><b>Keywords:</b> {item.features[0].properties.keywords}</p>
                        <p><b>Organization:</b> {item.features[0].properties.organisation}</p>
                        <p><b>Published:</b> {item.features[0].properties.published}</p>
                    </div>
                    <p class="description">{item.features[0].properties.description}</p>
                    <!-- <p><strong>Extent:</strong> {item.features[0].properties.extent}</p> -->
                    <button on:click={() => window.open("https://app-dev.geo.ca/result/en/" + item.features[0].properties.title.replace(/\W+/g, '-').toLowerCase() + "?id=" + item.features[0].properties.id + "&lang=en")}>
                        View record &rarr;
                    </button>
                </li>
            {/each}
        </ul>
    {:else}
        <p>
            Awaiting...
        </p>
    {/if}
    </div>

    <div>
    <h2>Keyword search results</h2>
    {#if keywordSearchResult.Count > 0}
        <!-- <p>1 – {keywordSearchResult.Count} of {keywordSearchResult.Items[0].total} records</p> -->
        <ul>
            {#each keywordSearchResult.Items as item (item.row_num)}
                <li>
                    {#if item.graphicOverview}
                        <!-- These two commands (?) don't belong here, but I don't yet know how else to make it work -->
                        {graphicOverview = JSON.parse(item.graphicOverview.replaceAll('""', '"'))}
                        {graphicOverview.length}
                        <!-- -->
                        {#if graphicOverview.length > 0}
                            {#if graphicOverview[0].overviewFileName !== "null"}
                                <img src={graphicOverview[0].overviewFileName} alt="Preview thumbnail of {item.title}" class="graphicOverview" />
                            {/if}
                        {/if}
                    {/if}
                    <a href={"https://app-dev.geo.ca/result/en/" + item.title.replace(/\W+/g, '-').toLowerCase() + "?id=" + item.id + "&lang=en"} target="_blank">
                        <h3>{item.row_num}. {item.title}</h3>
                    </a>
                    <div class="small">
                        <p><b>Keywords:</b> {item.keywords}</p>
                        <p><b>Organization:</b> {item.organisation}</p>
                        <p><b>Published:</b> {item.published}</p>
                    </div>
                    <p class="description">{item.description}</p>
                    <!-- <p><strong>Extent:</strong> {item.extent}</p> -->
                    <button on:click={() => window.open("https://app-dev.geo.ca/result/en/" + item.title.replace(/\W+/g, '-').toLowerCase() + "?id=" + item.id + "&lang=en")}>
                        View record &rarr;
                    </button>
                </li>
            {/each}
        </ul>
    {:else}
        <p>
            Awaiting...
        </p>
    {/if}
    </div>
    </div>
</main>

<Footer />

<style>
    main {
        font-family: Arial, sans-serif;
        padding: 1rem;
    }
    h2 {
        color: rebeccapurple;
    }
    input {
        padding: 0.5rem;
        margin-right: 0.5rem;
    }
    button {
        /* border-radius: 8px; */
        padding: 0.5rem;
    }
    button:hover {
        background-color: rgb(203, 192, 215);
    }
    button:focus {
        background-color: rgb(168, 144, 194);
    }
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        margin: 1rem 0;
        padding-left: 1rem;
        /* padding: 1rem; */
        border: 1px solid #ccc;
        min-height: 300px;
    }
    header button {
        font-size: 1rem;
    }
    img.graphicOverview {
        width: 300px;
        max-height: 300px;
        float: right;
    }
    .flex-container {
        margin-top: 1ex;
        display: flex;
        /*background-color: rebeccapurple;*/
        width: 100%;
        gap: 1em;
    }
    .flex-container > div {
        background-color: white;
        display: flex;
        flex-direction: column;
        flex-basis: 100%;
        flex: 1;
        border: solid 1px rebeccapurple;
        padding: 0 1ex;
    }
    .small {
        font-size: small;
    }
    .small > p {
        margin: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 1lh;
    }
    .description {
        /* Credit: https://stackoverflow.com/questions/33058004/applying-an-ellipsis-to-multiline-text
                   https://stackoverflow.com/questions/3922739/limit-text-length-to-n-lines-using-css */
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
</style>
