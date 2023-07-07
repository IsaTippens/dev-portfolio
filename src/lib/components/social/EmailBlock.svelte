<script>
    import SocialBlock from "$lib/components/social/SocialBlock.svelte";
    export let email;
</script>

<div class="bg-[#c71610]">
    <SocialBlock text="Email" user={email} url={`mailto:${email}`}/>
</div>