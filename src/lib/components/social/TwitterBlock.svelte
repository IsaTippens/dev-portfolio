<script>
    import SocialBlock from "./SocialBlock.svelte";
    export let user;
</script>

<div class="bg-[#1DA1F2]">
    <SocialBlock text="Twitter" user={`@${user}`} icon="twitter-white"/>
</div>