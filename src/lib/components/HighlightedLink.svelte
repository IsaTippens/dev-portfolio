<script>
    export let url;
    export let open_tab = true;
</script>


<a href={url} rel="external" target={open_tab ? '_blank' : '_self'} class="highlight-link">
    <slot/>
</a>