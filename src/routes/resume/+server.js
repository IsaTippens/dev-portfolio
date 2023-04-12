
export const GET = async () => {
    // Fetch pdf and download onto user's computer
    let data = await fetch("https://raw.githubusercontent.com/IsaTippens/dev-portfolio/main/content/resume/Isa Tippens CV.pdf")
    if (data.status === 404) {
        let resp = new Response("Not Found", { status: 404 })
        return resp
    }

    let buffer = await data.arrayBuffer()

    let dataB = Buffer.from(buffer)

    let resp =new Response(dataB, { headers: { 'Content-Type': 'application/pdf' } })
    return resp;
}