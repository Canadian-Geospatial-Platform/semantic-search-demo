<header class="fluid-container">
	<nav>
		<ul id="cgp">
			<li>
				<img src="favicon.png" alt="CGP logo" />
				Canadian Geospatial Platform
			</li>
		</ul>
		<ul>
			<!-- <li>
				<details class="dropdown">
					<summary class="secondary">Theme</summary>
					<ul>
						<li><a href="./" data-theme-switcher="auto">Auto</a></li>
						<li><a href="./" data-theme-switcher="light">Light</a></li>
						<li><a href="./" data-theme-switcher="dark">Dark</a></li>
					</ul>
				</details>
			</li> -->
			<li>
				<details class="dropdown">
					<summary> <i class="fa-brands fa-github"></i> GitHub </summary>
					{#snippet githubRepo(repo)}
						<a href="https://github.com/Canadian-Geospatial-Platform/{repo}" target="_blank">
							{repo}
						</a>
					{/snippet}
					<ul dir="rtl">
						<li>{@render githubRepo('semantic-search-model-evaluation')}</li>
						<li>{@render githubRepo('semantic-search-with-amazon-opensearch')}</li>
						<li>{@render githubRepo('semantic-search-demo')}</li>
					</ul>
				</details>
			</li>
		</ul>
	</nav>
</header>

<style>
    #cgp > li {
        font-size: 1.2em;
        font-weight: 600;
    }
    #cgp > li > img {
        height: 1.2em;
    }
    details,
	summary {
		font-weight: 500;
	}
</style>
