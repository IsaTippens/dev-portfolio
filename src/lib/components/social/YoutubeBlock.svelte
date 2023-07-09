<script>
    import SocialBlock from "$lib/components/social/SocialBlock.svelte";
    export let channel;
</script>

<div class="bg-[#c4302b]">
    <SocialBlock text="YouTube" user={channel} icon="youtube-white" url={"https://www.youtube.com/@" + channel}/>
</div>