<script>
    let { url, open_tab = true, children } = $props();
</script>


<a href="{url}" class="hover:underline" target={open_tab ? '_blank' : '_self'}>
    {@render children?.()}   
</a>
