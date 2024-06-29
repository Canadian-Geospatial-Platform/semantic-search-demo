<script lang="ts">
	interface Props {
		record?: any;
	}

	let { record = {} as any }: Props = $props();

	let appGeoCaBaseURL = 'https://app.geo.ca';
</script>

<li>
	{#if typeof record.graphicOverview === 'object' && Array.isArray(record.graphicOverview) && record.graphicOverview.length > 0 && record.graphicOverview.overviewFileName !== 'null'}
		<!-- from Semantic search-->
		<img
			src={record.graphicOverview[0].overviewFileName}
			alt="Preview thumbnail of {record.title}"
		/>
	{:else if typeof record.graphicOverview === 'string'}
		<!-- from Keyword search (Amazon Athena) -->
		{@const graphicOverview = JSON.parse(record.graphicOverview.replaceAll('""', '"'))}
		{#if graphicOverview.length > 0 && graphicOverview[0].overviewFileName !== 'null'}
			<img src={graphicOverview[0].overviewFileName} alt="Preview thumbnail of {record.title}" />
		{/if}
	{/if}
	<a
		href={appGeoCaBaseURL +
			'/result/en/' +
			record.title.replace(/\W+/g, '-').toLowerCase() +
			'?id=' +
			record.id +
			'&lang=en'}
		target="_blank"
	>
		<h3>{record.row_num}. {record.title}</h3>
	</a>
	<div class="small">
		{#if record.keywords}
			<p><b>Keywords:</b> {record.keywords}</p>
		{/if}
		{#if record.organisation}
			<p><b>Organization:</b> {record.organisation}</p>
		{/if}
		{#if record.published}
			<p><b>Published:</b> {record.published}</p>
		{/if}
	</div>
	<p class="description">{@html record.description.replaceAll('\\n', '<br />')}</p>
	<!-- <p><strong>Extent:</strong> {item.extent}</p> -->
	<button
		onclick={() =>
			window.open(
					appGeoCaBaseURL +
					record.title.replace(/\W+/g, '-').toLowerCase() +
					'?id=' +
					record.id +
					'&lang=en'
			)}
	>
		View record &rarr;
	</button>
	<div class="small">
		<p>
			{#if record.relevancy}
				<b>Relevancy:</b>
				{record.relevancy}{#if record.popularity};{/if}
			{/if}
			{#if record.popularity}
				<b>Popularity:</b> {record.popularity}
			{/if}
		</p>
	</div>
</li>

<style>
	li {
		margin: 1rem 0;
		padding-left: 1rem;
		/* padding: 1rem; */
		border: 1px solid #ccc;
		min-height: 280px;
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
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}
	img {
		width: 250px;
		max-height: 250px;
		float: right;
	}
</style>
