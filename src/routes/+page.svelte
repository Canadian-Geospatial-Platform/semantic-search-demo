<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { version } from '$app/environment';
	import RecordCard from '$lib/components/RecordCard.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { m } from "$lib/paraglide/messages.js";
	import { getLocale } from "$lib/paraglide/runtime.js";

	let query = $state('');

	// Define dropdown options for search modes
	const searchOptions = [
		{ value: 'keyword_search', label: 'Keyword Search' },
		{ value: 'semantic_search', label: 'Semantic Search' },
		{ value: 'semantic_search_new', label: 'Semantic Search *New*' }
	];

	// Define a mapping of search modes to their corresponding API endpoints
	type SearchEngine = 'keyword_search' | 'semantic_search' | 'semantic_search_new';
	const searchApiMap: Record<SearchEngine, (query: string) => string> = {
		keyword_search: (q) => `https://geocore.api.geo.ca/geo?keyword=${encodeURIComponent(q)}&keyword_only=true&lang=en&min=1&max=10&sort=popularity-desc`,
		semantic_search: (q) => `https://search-recherche.geocore.api.geo.ca/search-opensearch?method=SemanticSearch&q=${encodeURIComponent(q)}`,
		semantic_search_new: (q) => `https://search-recherche.geocore.api.geo.ca/search-opensearch?method=SemanticSearch&q=${encodeURIComponent(q)}`
	};

	let rightMode = $state(searchOptions[0].value);
	let leftMode = $state(searchOptions[1].value);
	
	const searchOptionLabels = Object.fromEntries(
		searchOptions.map(o => [o.value, o.label])
	);
	
	// let keywordSearchURL = $derived(
	// 	`https://geocore.api.geo.ca/geo?keyword=${encodeURIComponent(query)}&keyword_only=true&lang=en&min=1&max=10&sort=popularity-desc`
	// );
	// let semanticSearchURL = $derived(
	// 	`https://search-recherche.geocore.api.geo.ca/search-opensearch?method=SemanticSearch&q=${encodeURIComponent(query)}`
	// );
	let promiseLeft = $state.raw({} as Promise<any>);
	let promiseRight = $state.raw({} as Promise<any>);
	let searchInitiated = $state(false);

	async function fetchSearchResults(url: string): Promise<any> {
		const res = await fetch(url);
		const data = await res.json();
		return data;
	}

	// async function fetchKeywordSearchResults(query: string): Promise<any> {
	// 	const res = await fetch(keywordSearchURL);
	// 	console.log(res);
	// 	const data = await res.json();
	// 	return data;
	// }

	// async function fetchSemanticSearchResults(query: string): Promise<any> {
	// 	const res = await fetch(semanticSearchURL);
	// 	const data = await res.json();
	// 	return data;
	// }
	
	// Derive the search URLs based on the selected modes and query
	const urlLeft = $derived(searchApiMap[leftMode](query));
	const urlRight = $derived(searchApiMap[rightMode](query));

	async function handleSearch(event: Event) {
		event.preventDefault();
		if (!query.trim()) {
			alert('Please enter a search query.'); // Basic validation feedback
			return;
		}
		searchInitiated = true;

		promiseLeft = fetchSearchResults(urlLeft);
		promiseRight = fetchSearchResults(urlRight);
	}

	function clearSearchResults() {
		promiseLeft = Promise.resolve({});
		promiseRight = Promise.resolve({});
		searchInitiated = false;
	}

	// function refreshSearchResults(event: Event) {
	// 	console.log("Set comparison");
	// 	clearSearchResults();

	// 	if (query.trim()) {
	// 		handleSearch(event);
	// 	}
	// 	console.log("Done.");
	// }
	console.log(getLocale());
</script>

<svelte:head>
	<title>{m.website_title()}</title>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
		integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</svelte:head>

<Header />

<main class="fluid-container">
	<section class="container" id="title">
		<h1>Semantic Search API Demo for GEO.ca</h1>
		<p>Front-end demo v{version} (2025-04-30), work-in-progress</p>
	</section>

	<section class="container grid">
		<article>
			Semantic search engines surpass simple keyword matching by interpreting the intent and context
			of queries. Unlike traditional searches, semantic search processes natural language and
			complex requests, recognizing synonyms and variations. We fine-tuned Sentence-Transformer
			models to enhance search relevance for geospatial metadata. The semantic search API is
			deployed using Amazon OpenSearch and Amazon SageMaker.
		</article>

		{#snippet githubRepo(repo)}
			<a href="https://github.com/Canadian-Geospatial-Platform/{repo}" target="_blank">{repo}</a>
		{/snippet}
		<article>
			<p>Visit our GitHub repositories:</p>
			<ul class="github-repo">
				<li>{@render githubRepo('semantic-search-model-evaluation')}</li>
				<li>{@render githubRepo('semantic-search-with-amazon-opensearch')}</li>
				<li>{@render githubRepo('semantic-search-demo')}</li>
			</ul>
		</article>
	</section>

	<section class="container">
		<form role="comparison" class="side-by-side">
			<select bind:value={leftMode} onchange={clearSearchResults} class="select-search-mode">
				{#each searchOptions as option}
					<option value={option.value}>
						{option.label}
					</option>
				{/each}
			</select>
			<em style="position:relative; top:-1px;">VS</em>
			<select bind:value={rightMode} onchange={clearSearchResults} class="select-search-mode">
				{#each searchOptions as option}
					<option value={option.value}> {option.label} </option>
				{/each}
			</select>
		</form>
		<form role="search" onsubmit={handleSearch}>
			<input
				aria-label="Search"
				name="search"
				type="search"
				autofocus
				bind:value={query}
				oninput={clearSearchResults}
			/>
			<input type="submit" value="Search" id="search-submit" />
		</form>
	</section>

	{#snippet showSearchURL(url)}
		<p class="search-url">URL: <a href={url} target="_blank">{url}</a></p>
	{/snippet}

	{#snippet loadingResults()}
		<p aria-busy="true">Fetching search results…</p>
	{/snippet}

	<section>
		{#if searchInitiated}
			<div class="grid">
				<div>
					<h2>{searchOptionLabels[leftMode]} results</h2>
					<!-- <p>Sorted by relevancy</p> -->
					{@render showSearchURL(urlLeft)}
					{#await promiseLeft}
						{@render loadingResults()}
					{:then data}
						{#if leftMode === 'keyword_search'}
							{#if data.Count > 0}
								<p class="center">1 – {data.Count} of {data.Items[0].total} records</p>
								<div class="search-results">
									{#each data.Items as record (record.row_num)}
										<RecordCard {record} />
									{/each}
								</div>
							{:else if data.Count === 0}
								<p>No result</p>
							{:else}
								<p class="error">{data.errorMessage}</p>
								<textarea rows="20" spellcheck="false">{JSON.stringify(data, null, 4)}</textarea>
							{/if}
						{:else}
							{#if data.response && data.response.total_hits > 0}
								<p class="center">1 – {data.response.returned_hits} of {data.response.total_hits} records</p>
								<div class="search-results">
									{#each data.response.items as item (item.features[0].properties.row_num)}
										{@const record = item.features[0].properties}
										<RecordCard {record} />
									{/each}
								</div>
							{:else if data.response && data.response.total_hits === 0}
								<p>No result</p>
							{:else}
								<p class="error">Parse error.  This demo likely needs to be updated to the latest API.</p>
								<p>Returned results in JSON format:</p>
								<p class="error">{data.message}</p>
								<textarea rows="50" spellcheck="false">{JSON.stringify(data, null, 4)}</textarea>
							{/if}
						{/if}
					{:catch error}
						<p class="error">Error: {error}</p>
					{/await}
				</div>

				<div>
					<h2>{searchOptionLabels[rightMode]} results</h2>
					<!-- <p>Sorted by popularity (relevancy not available)</p> -->
					{@render showSearchURL(urlRight)}
					{#await promiseRight}
						{@render loadingResults()}
					{:then data}
						{#if rightMode === 'keyword_search'}
							{#if data.Count > 0}
								<p class="center">1 – {data.Count} of {data.Items[0].total} records</p>
								<div class="search-results">
									{#each data.Items as record (record.row_num)}
										<RecordCard {record} />
									{/each}
								</div>
							{:else if data.Count === 0}
								<p>No result</p>
							{:else}
								<p class="error">{data.errorMessage}</p>
								<textarea rows="20" spellcheck="false">{JSON.stringify(data, null, 4)}</textarea>
							{/if}
						{:else}
							{#if data.response && data.response.total_hits > 0}
								<p class="center">1 – {data.response.returned_hits} of {data.response.total_hits} records</p>
								<div class="search-results">
									{#each data.response.items as item (item.features[0].properties.row_num)}
										{@const record = item.features[0].properties}
										<RecordCard {record} />
									{/each}
								</div>
							{:else if data.response && data.response.total_hits === 0}
								<p>No result</p>
							{:else}
								<p class="error">Parse error.  This demo likely needs to be updated to the latest API.</p>
								<p>Returned results in JSON format:</p>
								<p class="error">{data.message}</p>
								<textarea rows="50" spellcheck="false">{JSON.stringify(data, null, 4)}</textarea>
							{/if}
						{/if}
					{:catch error}
						<p class="error">Error: {error}</p>
					{/await}
				</div>
			</div>
		{/if}
	</section>
</main>

<Footer />

<style>
	main {
		margin-top: 2rem;
	}
	#title {
		margin-bottom: 2rem;
	}
	input {
		font-size: 125%;
		height: 4rem;
	}
	
	.side-by-side {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-left: auto;
		margin-right: auto;
		width: max-content;
		color: var(--pico-secondary);
    	font-weight: bold;
		background-color: var(--pico-secondary-focus);
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
	}
	
	.side-by-side select {
		border: None;
		padding-right: 2rem;
		cursor: pointer;
		background-color: transparent;
		text-transform: capitalize;
		margin: 1rem;
	}

	p.search-url {
		font-size: 0.8em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	p.error {
		color: red;
	}
	p.center {
		text-align: center;
	}
	textarea {
		field-sizing: content;
		padding: 1ex;
		resize: none;
	}
	.search-results {
		padding: 0;
	}
	ul.github-repo {
		margin-bottom: 0px;
	}
</style>
