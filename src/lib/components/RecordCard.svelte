<script lang="ts">
	import { getLocale } from "$lib/paraglide/runtime.js";
	import { m } from "$lib/paraglide/messages.js";

	interface Props {
		record?: any;
	}

	let { record = {} as any }: Props = $props();

	let lang = getLocale();

	let title = record[`title_${lang}`] ?? record.title;
	let keywords = record[`keywords_${lang}`] ?? record.keywords;
	let description = record[`description_${lang}`] ?? record.description;

	let thumbnailURL =
		'https://app.geo.ca/result/' + lang + '/' +
		title.replace(/\W+/g, '-').toLowerCase() +
		'?id=' + record.id +
		'&lang=' + lang;

	async function showPlaceholder(event) {
		event.target.src =
			'https://placehold.co/230/aliceblue/grey?text=Preview+image\\nfailed+to+load';
	}
</script>

<article>
	<div class="thumbnail-container">
		{#snippet showThumbnail(src, alt)}
			<img {src} {alt} onerror={showPlaceholder} />
		{/snippet}
		{#snippet noPreview()}
			<img src="https://placehold.co/230/aliceblue/grey?text=No+preview" alt="No preview" />
		{/snippet}
		{#if typeof record.graphicOverview === 'object' && Array.isArray(record.graphicOverview) && record.graphicOverview.length > 0 && record.graphicOverview.overviewFileName !== 'null'}
			<!-- from Semantic search-->
			{@render showThumbnail(
				record.graphicOverview[0].overviewFileName,
				`Preview image of ${title}`
			)}
		{:else if typeof record.graphicOverview === 'string'}
			<!-- from Keyword search (Amazon Athena) -->
			{@const graphicOverview = JSON.parse(record.graphicOverview.replaceAll('""', '"'))}
			{#if graphicOverview.length > 0 && graphicOverview[0].overviewFileName !== 'null'}
				{@render showThumbnail(
					graphicOverview[0].overviewFileName,
					`Preview image of ${title}`
				)}
			{:else}
				{@render noPreview()}
			{/if}
		{:else}
			{@render noPreview()}
		{/if}
	</div>
	<h3>{record.row_num}. <a href={thumbnailURL} target="_blank">{title}</a></h3>
	<div class="small">
		{#if keywords}
			<p><b>{m.record_card_keywords()}:</b> {keywords}</p>
		{/if}
		{#if record.organisation}
			<p><b>{m.record_card_organization()}:</b> {record.organisation}</p>
		{/if}
		<div class="grid">
			{#if record.published}
				<p><b>{m.record_card_published()}:</b> {record.published}</p>
				<p>
					{#if record.relevancy}
						<b>{m.record_card_relevancy()}:</b>
						{record.relevancy}{#if record.popularity};{/if}
					{/if}
					{#if record.popularity}
						<b>{m.record_card_popularity()}:</b> {record.popularity}
					{/if}
				</p>
			{/if}
		</div>
	</div>
	<p class="description">{@html description.replaceAll('\\n', '<br />')}</p>
	<!-- <p><strong>Extent:</strong> {item.extent}</p> -->
	<button onclick={() => window.open(thumbnailURL)}> {m.record_card_view_record()} &rarr; </button>
</article>

<style>
	article {
		margin: 1rem 0;
		min-height: 260px;
	}
	h3 {
		padding-left: 1.2em;
		text-indent: -1.2em;
	}
	.small {
		font-size: small;
	}
	.small > p {
		height: 1lh;
		margin: 0 1em 0 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.description {
		/* Credit: https://stackoverflow.com/questions/33058004/applying-an-ellipsis-to-multiline-text
                   https://stackoverflow.com/questions/3922739/limit-text-length-to-n-lines-using-css */
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.thumbnail-container {
		border: 1px solid silver;
		width: 230px;
		height: 230px;
		float: right;
		margin-left: 1em;
	}
	img {
		width: 230px;
		max-height: 230px;
	}
</style>
