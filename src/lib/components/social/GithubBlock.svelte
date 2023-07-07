<script>
    import SocialBlock from "./SocialBlock.svelte";
    export let user;
</script>

<div class="bg-[#333]">
    <SocialBlock text="Github" user={`@${user}`} icon="github-white"/>
</div>