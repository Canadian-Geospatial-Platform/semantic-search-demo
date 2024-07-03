<script lang="ts">
	import { version } from '$app/environment';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import RecordCard from '$lib/components/RecordCard.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let query = $state('');
	let keywordSearchURL = $derived(
		`https://geocore.api.geo.ca/geo?keyword=${encodeURIComponent(query)}&keyword_only=true&lang=en&min=1&max=10&sort=popularity-desc`
	);
	let semanticSearchURL = $derived(
		`https://search-recherche.geocore.api.geo.ca/search-opensearch?method=SemanticSearch&searchString=${encodeURIComponent(query)}`
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

<!-- <Header /> -->

<main>
	<div class="container mx-auto space-y-8 p-8">
		<!-- <div class="container mx-auto space-y-8 p-8"> -->
		<h1 class="h1">Semantic Search API Demo for GEO.ca</h1>
		<!-- <p>(Scheduled for released in December 2024)</p> -->

		<p>Front-end demo v{version} (2024-07-03), work-in-progress</p>

		<div class="card p-4 bg-fuschia-300">
			Semantic search engines surpass simple keyword matching by interpreting the intent and context
			of queries. Unlike traditional searches, semantic search processes natural language and
			complex requests, recognizing synonyms and variations. We fine-tuned Sentence-Transformer
			models to enhance search relevance for geospatial metadata. The semantic search API is
			deployed using Amazon OpenSearch and Amazon SageMaker.
		</div>

		<section>
			<form id="searchForm" onsubmit={handleSearch}>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim">
						<i class="fa-solid fa-search"></i>
					</div>
					<input
						type="search"
						bind:value={query}
						oninput={clearSearchResults}
						placeholder="Search..."
					/>
					<button type="submit" class="variant-filled-secondary">Submit</button>
				</div>
			</form>
		</section>

		{#snippet showSearchURL(url)}
			<p class="search-url overflow-hidden overflow-ellipsis">
				<a href={url} target="_blank">{url}</a>
			</p>
		{/snippet}

		<section>
			{#if searchInitiated}
				<div class="flex flex-row gap-5">
					<div class="basis-1/2 bg-fuschia-50/50 border-2 border-blue-800 p-4">
						<h2 class="h2">Semantic search results</h2>
						<!-- <p>Sorted by relevancy</p> -->
						{@render showSearchURL(semanticSearchURL)}
						{#await semanticPromise}
							<p>Fetching results…</p>
							<Placeholder />
						{:then data}
							{#if data.body && data.body.response && data.body.response.total_hits > 0}
								<!-- <p>
									1 – {data.body.response.total_hits} of {data.body.response.total_hits}(?) records
								</p> -->
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

					<div class="basis-1/2 bg-fuschia-50/50 border-2 border-blue-800 p-4">
						<h2 class="h2">Keyword search results</h2>
						<!-- <p>Sorted by popularity (relevancy not available)</p> -->
						{@render showSearchURL(keywordSearchURL)}
						{#await keywordPromise}
							<p>Fetching results…</p>
							<Placeholder />
						{:then data}
							{#if data.Count > 0}
								<!-- <p>1 – {data.Count} of {data.Items[0].total} records</p> -->
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
		</section>
	</div>
</main>

<Footer />

<style>
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
