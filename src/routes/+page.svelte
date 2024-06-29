<script lang="ts">
	import { version } from '$app/environment';
	import RecordCard from '$lib/components/RecordCard.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let query = $state('');
	let keywordSearchURL = $derived(
		`https://geocore-dev.api.geo.ca/geo?keyword=${encodeURIComponent(query)}&keyword_only=true&lang=en&min=1&max=10&sort=popularity-desc`
	);
	let semanticSearchURL = $derived(
		`https://search-recherche.geocore-dev.api.geo.ca/search-opensearch?method=SemanticSearch&searchString=${encodeURIComponent(query)}`
	);
	let keywordPromise = $state.frozen({} as Promise<any>);
	let semanticPromise = $state.frozen({} as Promise<any>);
	let searchInitiated = $state(false);

	async function fetchKeywordSearchResults(query: string): Promise<any> {
		const res = await fetch(keywordSearchURL);
		console.log(res);
		const data = await res.json();
		return data;
	}

	async function fetchSemanticSearchResults(query: string): Promise<any> {
		const res = await fetch(semanticSearchURL);
		const data = await res.json();
		return data;
	}

	async function handleSearch(event: Event) {
		event.preventDefault();
		if (!query.trim()) {
			alert('Please enter a search query.'); // Basic validation feedback
			return;
		}
		searchInitiated = true;
		keywordPromise = fetchKeywordSearchResults(query);
		semanticPromise = fetchSemanticSearchResults(query);
	}

	function clearSearchResults() {
		keywordPromise = Promise.resolve({});
		semanticPromise = Promise.resolve({});
		searchInitiated = false;
	}
</script>

<svelte:head>
	<title>Semantic Search API Demo for GEO.ca</title>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
		integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</svelte:head>

<main>
	<h1>Semantic Search API Demo for GEO.ca</h1>
	<p>(Scheduled for released in December 2024)</p>
	<p>
		Please note that this current version queries our development servers and works only within
		NRCan/GoC network.
	</p>
	<p>Front-end demo v{version} (2024-06-29), work-in-progress</p>

	<form id="searchForm" onsubmit={handleSearch}>
		<input
			type="text"
			bind:value={query}
			oninput={clearSearchResults}
			placeholder="Enter search query"
		/>
		<button type="submit">Search</button>
	</form>

	{#snippet showSearchURL(url)}
		<p class="search-url">URL: <a href={url} target="_blank">{url}</a></p>
	{/snippet}

	{#if searchInitiated}
		<div class="flex-container">
			<div>
				<h2>Semantic search results</h2>
				<!-- <p>Sorted by relevancy</p> -->
				{@render showSearchURL(semanticSearchURL)}
				{#await semanticPromise}
					<p>Fetching results…</p>
				{:then data}
					{#if data.body && data.body.response && data.body.response.total_hits > 0}
						<p>1 – {data.body.response.total_hits} of {data.body.response.total_hits}(?) records</p>
						<ul>
							{#each data.body.response.items as item (item.features[0].properties.row_num)}
								{@const record = item.features[0].properties}
								<RecordCard {record} />
							{/each}
						</ul>
					{:else if data.body && data.body.response && data.body.response.total_hits === 0}
						<p>No result</p>
					{:else}
						<p class="error">{data.message}</p>
						<textarea rows="20" spellcheck="false">{JSON.stringify(data, null, 4)}</textarea>
					{/if}
				{:catch error}
					<p class="error">Error: {error}</p>
				{/await}
			</div>

			<div>
				<h2>Keyword search results</h2>
				<!-- <p>Sorted by popularity (relevancy not available)</p> -->
				{@render showSearchURL(keywordSearchURL)}
				{#await keywordPromise}
					<p>Fetching results…</p>
				{:then data}
					{#if data.Count > 0}
						<p>1 – {data.Count} of {data.Items[0].total} records</p>
						<ul>
							{#each data.Items as record (record.row_num)}
								<RecordCard {record} />
							{/each}
						</ul>
					{:else if data.Count === 0}
						<p>No result</p>
					{:else}
						<p class="error">{data.errorMessage}</p>
						<textarea rows="20" spellcheck="false">{JSON.stringify(data, null, 4)}</textarea>
					{/if}
				{:catch error}
					<p class="error">Error: {error}</p>
				{/await}
			</div>
		</div>
	{/if}
</main>

<Footer />

<style>
	main {
		font-family: Arial, sans-serif;
		padding: 1rem;
	}
	input {
		padding: 0.5rem;
		margin-right: 0.5rem;
		width: 32em;
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
	h2 {
		color: rebeccapurple;
		margin-bottom: 0;
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
	p.search-url {
		font-size: 0.8em;
	}
	p.error {
		color: red;
	}
	textarea {
		field-sizing: content;
		padding: 1ex;
		resize: none;
	}
</style>
