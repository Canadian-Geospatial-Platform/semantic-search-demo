<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { version } from '$app/environment';
	import RecordCard from '$lib/components/RecordCard.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let query = $state('');
	let keywordSearchURL = $derived(
		`https://geocore.api.geo.ca/geo?keyword=${encodeURIComponent(query)}&keyword_only=true&lang=en&min=1&max=10&sort=popularity-desc`
	);
	let semanticSearchURL = $derived(
		`https://search-recherche.geocore.api.geo.ca/search-opensearch?method=SemanticSearch&q=${encodeURIComponent(query)}`
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

<Header />

<main class="fluid-container">
	<section class="container" id="title">
		<h1>Semantic Search API Demo for GEO.ca</h1>
		<p>Front-end demo v{version} (2025-01-23), work-in-progress</p>
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
		<form role="search" onsubmit={handleSearch}>
			<input
				aria-label="Search"
				name="search"
				type="search"
				autofocus
				bind:value={query}
				oninput={clearSearchResults}
			/>
			<input type="submit" value="Search" />
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
					<h2>Semantic search results</h2>
					<!-- <p>Sorted by relevancy</p> -->
					{@render showSearchURL(semanticSearchURL)}
					{#await semanticPromise}
						{@render loadingResults()}
					{:then data}
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
					{:catch error}
						<p class="error">Error: {error}</p>
					{/await}
				</div>

				<div>
					<h2>Keyword search results</h2>
					<!-- <p>Sorted by popularity (relevancy not available)</p> -->
					{@render showSearchURL(keywordSearchURL)}
					{#await keywordPromise}
						{@render loadingResults()}
					{:then data}
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
