<script>
    import SocialBlock from "./SocialBlock.svelte";
    export let user;
</script>

<div class="bg-[#333]">
    <SocialBlock text="Github" user={`@${user}`} icon="github-white" url={"https://www.github.com/" + user}/>
</div>