<script>
    import SocialBlock from "$lib/components/social/SocialBlock.svelte";
    export let email;
</script>

<div class="bg-[#3e65cf]">
    <SocialBlock text="Email" user={email} url={`mailto:${email}`} icon="gmail-white"/>
</div>