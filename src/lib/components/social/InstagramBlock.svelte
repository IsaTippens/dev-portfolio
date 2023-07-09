<script>
    import SocialBlock from "./SocialBlock.svelte";
    export let user;
</script>

<div class="bg-gradient-to-tr from-[#feda75] from-10% via-red-500 via-70% to-[#4f5bd5] to-90%">
    <SocialBlock text="Instagram" user={`@${user}`} icon="instagram-white" url={"https://www.instagram.com/" + user}/>
</div>