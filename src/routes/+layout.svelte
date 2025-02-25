<script lang="ts">
	import '@picocss/pico/css/pico.min.css';
    import '../app.css'
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}
