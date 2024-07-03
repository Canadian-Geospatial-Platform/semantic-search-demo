<script lang="ts">
	function openGitHubSemanticSearchModelEvaluation() {
		window.open('https://github.com/Canadian-Geospatial-Platform/semantic-search-model-evaluation');
	}

	function openGitHubSemanticSearchWithOpenSearch() {
		window.open(
			'https://github.com/Canadian-Geospatial-Platform/semantic-search-with-amazon-opensearch'
		);
	}

	function openGitHubSemanticSearchDemo() {
		window.open('https://github.com/Canadian-Geospatial-Platform/semantic-search-demo');
	}
</script>

<footer>
	<div class="container mx-auto">
		<p>GeoDiscovery, Canada Centre for Mapping and Earth Observation, Government of Canada, 2024</p>
		<ul>
			<li>
				<button on:click={openGitHubSemanticSearchModelEvaluation} class="btn-sm variant-ghost-surface">
					<i class="fa-brands fa-github" style="font-size: larger;"></i> GitHub
				</button>
				<a
					href="https://github.com/Canadian-Geospatial-Platform/semantic-search-model-evaluation"
					target="_blank"
				>
					Canadian-Geospatial-Platform/semantic-search-model-evaluation
				</a>
			</li>
			<li>
				<button on:click={openGitHubSemanticSearchWithOpenSearch} class="btn-sm variant-ghost-surface">
					<i class="fa-brands fa-github" style="font-size: larger;"></i> GitHub
				</button>
				<a
					href="https://github.com/Canadian-Geospatial-Platform/semantic-search-with-amazon-opensearch"
					target="_blank"
				>
					Canadian-Geospatial-Platform/semantic-search-with-amazon-opensearch
				</a>
			</li>
			<li>
				<button on:click={openGitHubSemanticSearchDemo} class="btn-sm variant-ghost-surface">
					<i class="fa-brands fa-github" style="font-size: larger;"></i> GitHub
				</button>
				<a
					href="https://github.com/Canadian-Geospatial-Platform/semantic-search-demo"
					target="_blank"
				>
					Canadian-Geospatial-Platform/semantic-search-demo
				</a>
			</li>
		</ul>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid black;
		font-family: Arial, sans-serif;
		padding-left: 1rem;
	}
</style>
