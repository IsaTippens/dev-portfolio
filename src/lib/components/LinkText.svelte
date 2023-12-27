<script>
    export let url;
    export let open_tab = true;
</script>


<a href="{url}" class="hover:underline" target={open_tab ? '_blank' : '_self'}>
    <slot />   
</a>
