<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import { onMount } from 'svelte';

    let query = '';
    let result = {} as any;

    async function handleSearch() {
        const response = await fetch(`https://search-recherche.geocore-dev.api.geo.ca/search-opensearch?method=SemanticSearch&searchString=${query}`);
        const data = await response.json();
        result = data.body.response;  // Adjust this based on the actual structure of your returned JSON
        console.log(result.items);
    }
</script>

<svelte:head>
    <title>Semantic Search API Demo for GEO.ca</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script defer src="https://api.productsurveys.io/script/8divLEFQtBobiGKhmRJ5f8"></script>
</svelte:head>

<main>
    <h1>Semantic Search API Demo</h1>
    <p>(for future GEO.ca)</p>
    <p>Please note that this current version queries our development server and works only within NRCan/GoC network.</p>

    <form id="searchForm">
        <input type="text" bind:value={query} placeholder="Enter search query" />
        <button type="submit" on:click={handleSearch}>Search</button>
    </form>

    {#if result.total_hits > 0}
        <ul>
            {#each result.items as item}
                <li>
                    {#if item.features[0].properties.graphicOverview[0] && item.features[0].properties.graphicOverview[0].overviewFileName}
                        <img src={item.features[0].properties.graphicOverview[0].overviewFileName} alt="Preview thumbnail of {item.features[0].properties.title}" class="graphicOverview" />
                    {/if}
                    <a href={"https://app.geo.ca/result/en/" + item.features[0].properties.title.replace(/\W+/g, '-').toLowerCase() + "?id=" + item.features[0].properties.id + "&lang=en"} target="_blank">
                        <h2>{item.features[0].properties.title}</h2>
                    </a>
                    <p>{item.features[0].properties.description}</p>
                    <!-- <p><strong>Extent:</strong> {item.extent}</p> -->
                    <button on:click={() => window.open("https://app.geo.ca/result/en/" + item.features[0].properties.title.replace(/\W+/g, '-').toLowerCase() + "?id=" + item.features[0].properties.id + "&lang=en")}>
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
</style>
