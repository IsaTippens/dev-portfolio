<script>
    import SocialBlock from "./SocialBlock.svelte";
    export let user;
</script>

<div class="bg-[#f5f5f5] dark:bg-[#333]">
    <SocialBlock text="Github" user={`@${user}`}/>
</div>