<script>
    let { url, open_tab = true, children } = $props();
</script>


<a href={url} rel="external" target={open_tab ? '_blank' : '_self'} class="highlight-link">
    {@render children?.()}
</a>