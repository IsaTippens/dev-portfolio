<script context="module">
    import {Tile, UnorderedList, ListItem} from 'carbon-components-svelte';
</script>

<script>
    // List of strings
    export let title;
    export let data;
</script>

<Tile>
    <h1>{title}</h1>
    <UnorderedList>
        {#each data as item}
            <ListItem>{item}</ListItem>
        {/each}
    </UnorderedList>
</Tile>