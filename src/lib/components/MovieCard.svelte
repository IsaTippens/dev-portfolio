<script>
    let { title, year, children } = $props();
</script>



<div>
    <!--Cetner the text vertically-->
    <div class="bg-gradient-to-r from-cyan-500 to-blue-500 px-2 h-12 flex  ">
        <span class="font-semibold text-white text-2xl">{title} <span class="text-white text-base">{year}</span></span>
    </div>
    {@render children?.()}
</div>
