<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { version } from '$app/environment';
	import RecordCard from '$lib/components/RecordCard.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { m } from "$lib/paraglide/messages.js";
	import { getLocale } from "$lib/paraglide/runtime.js";
	import { get } from 'svelte/store';
	import posthog from 'posthog-js';

	let query = $state('');

	// Define dropdown options for search modes
	const searchOptions = [
		{ value: 'keyword_search', label: m.keyword_search() },
		{ value: 'semantic_search', label: m.semantic_search() },
		{ value: 'semantic_search_new', label: m.semantic_search_new() }
	];

	// Define a mapping of search modes to their corresponding API endpoints
	type SearchEngine = 'keyword_search' | 'semantic_search' | 'semantic_search_new';
	const searchApiMap: Record<SearchEngine, (query: string) => string> = {
		keyword_search: (q) => `https://geocore.api.geo.ca/geo?keyword=${encodeURIComponent(q)}&keyword_only=true&lang=${getLocale()}&min=1&max=10&sort=popularity-desc`,
		semantic_search: (q) => `https://search-recherche.geocore.api.geo.ca/search-opensearch?method=SemanticSearch&q=${encodeURIComponent(q)}`,
		semantic_search_new: (q) => `https://search-recherche.geocore.api.geo.ca/search-opensearch?method=SemanticSearch&q=${encodeURIComponent(q)}`
	};

	let rightMode = $state(searchOptions[0].value);
	let leftMode = $state(searchOptions[1].value);
	
	const searchOptionLabels = Object.fromEntries(
		searchOptions.map(o => [o.value, o.label])
	);
	
	let promiseLeft = $state.raw({} as Promise<any>);
	let promiseRight = $state.raw({} as Promise<any>);
	let searchInitiated = $state(false);

	async function fetchSearchResults(url: string): Promise<any> {
		const res = await fetch(url);
		const data = await res.json();
		return data;
	}
	
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
		
		posthog.capture('search_performed', {
			query,
		})

		if (getLocale() == 'en') {
			posthog.displaySurvey('019f37a0-7c58-0000-abd2-2c3958e39793')
		}
		else {
			posthog.displaySurvey('019f3cf9-c8ba-0000-5d0d-31211fca0025')
		}

		promiseLeft = fetchSearchResults(urlLeft);
		promiseRight = fetchSearchResults(urlRight);
	}

	function clearSearchResults() {
		promiseLeft = Promise.resolve({});
		promiseRight = Promise.resolve({});
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
		<h1>{m.website_header()}</h1>
		<p>v{version} (2025-04-30)</p>
	</section>

	<section class="container grid">
		<article>
			{m.semantic_search_description()}
		</article>

		{#snippet githubRepo(repo)}
			<a href="https://github.com/Canadian-Geospatial-Platform/{repo}" target="_blank">{repo}</a>
		{/snippet}
		<article>
			<p>{m.visit_github_call()}</p>
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
			<input type="submit" value={m.search_button()} id="search-submit" 
				class:lang-en={getLocale() === "en"}
				class:lang-fr={getLocale() === "fr"}
			/>
		</form>
	</section>

	{#snippet showSearchURL(url)}
		<p class="search-url">URL: <a href={url} target="_blank">{url}</a></p>
	{/snippet}

	{#snippet loadingResults()}
		<p aria-busy="true">{m.search_load_message()}</p>
	{/snippet}

	<section>
		{#if searchInitiated}
			<div class="grid">
				<div>
					<h2>{searchOptionLabels[leftMode]} {m.results_text()}</h2>
					<!-- <p>Sorted by relevancy</p> -->
					{@render showSearchURL(urlLeft)}
					{#await promiseLeft}
						{@render loadingResults()}
					{:then data}
						{#if leftMode === 'keyword_search'}
							{#if data.Count > 0}
								<p class="center">{m.records_retrieved_text({ data_count: data.Count, total: data.Items[0].total })}</p>
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
								<p class="center">{m.records_retrieved_text({ data_count: data.response.returned_hits, total: data.response.total_hits })}</p>
								<div class="search-results">
									{#each data.response.items as item (item.features[0].properties.row_num)}
										{@const record = item.features[0].properties}
										<RecordCard {record} />
									{/each}
								</div>
							{:else if data.response && data.response.total_hits === 0}
								<p>No result</p>
							{:else}
								<p class="error">{m.parse_error()}</p>
								<p>{m.parse_error_json_output()}</p>
								<p class="error">{data.message}</p>
								<textarea rows="50" spellcheck="false">{JSON.stringify(data, null, 4)}</textarea>
							{/if}
						{/if}
					{:catch error}
						<p class="error">{m.error_label()} {error}</p>
					{/await}
				</div>

				<div>
					<h2>{searchOptionLabels[rightMode]} {m.results_text()}</h2>
					<!-- <p>Sorted by popularity (relevancy not available)</p> -->
					{@render showSearchURL(urlRight)}
					{#await promiseRight}
						{@render loadingResults()}
					{:then data}
						{#if rightMode === 'keyword_search'}
							{#if data.Count > 0}
								<p class="center">{m.records_retrieved_text({ data_count: data.Count, total: data.Items[0].total })}</p>
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
								<p class="center">{m.records_retrieved_text({ data_count: data.response.returned_hits, total: data.response.total_hits })}</p>
								<div class="search-results">
									{#each data.response.items as item (item.features[0].properties.row_num)}
										{@const record = item.features[0].properties}
										<RecordCard {record} />
									{/each}
								</div>
							{:else if data.response && data.response.total_hits === 0}
								<p>No result</p>
							{:else}
								<p class="error">{m.parse_error()}</p>
								<p>{m.parse_error_json_output()}</p>
								<p class="error">{data.message}</p>
								<textarea rows="50" spellcheck="false">{JSON.stringify(data, null, 4)}</textarea>
							{/if}
						{/if}
					{:catch error}
						<p class="error">{m.error_label()} {error}</p>
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
