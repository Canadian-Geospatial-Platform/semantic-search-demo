<script lang="ts">
	interface Props {
		record?: any;
	}

	let { record = {} as any }: Props = $props();

	let thumbnailURL =
		'https://app.geo.ca/result/en/' +
		record.title.replace(/\W+/g, '-').toLowerCase() +
		'?id=' +
		record.id +
		'&lang=en';

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
				'Preview image of {record.title}'
			)}
		{:else if typeof record.graphicOverview === 'string'}
			<!-- from Keyword search (Amazon Athena) -->
			{@const graphicOverview = JSON.parse(record.graphicOverview.replaceAll('""', '"'))}
			{#if graphicOverview.length > 0 && graphicOverview[0].overviewFileName !== 'null'}
				{@render showThumbnail(
					graphicOverview[0].overviewFileName,
					'Preview image of {record.title}'
				)}
			{:else}
				{@render noPreview()}
			{/if}
		{:else}
			{@render noPreview()}
		{/if}
	</div>
	<h3>{record.row_num}. <a href={thumbnailURL} target="_blank">{record.title}</a></h3>
	<div class="small">
		{#if record.keywords}
			<p><b>Keywords:</b> {record.keywords}</p>
		{/if}
		{#if record.organisation}
			<p><b>Organization:</b> {record.organisation}</p>
		{/if}
		<div class="grid">
			{#if record.published}
				<p><b>Published:</b> {record.published}</p>
				<p>
					{#if record.relevancy}
						<b>Relevancy:</b>
						{record.relevancy}{#if record.popularity};{/if}
					{/if}
					{#if record.popularity}
						<b>Popularity:</b> {record.popularity}
					{/if}
				</p>
			{/if}
		</div>
	</div>
	<p class="description">{@html record.description.replaceAll('\\n', '<br />')}</p>
	<!-- <p><strong>Extent:</strong> {item.extent}</p> -->
	<button onclick={() => window.open(thumbnailURL)}> View record &rarr; </button>
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
