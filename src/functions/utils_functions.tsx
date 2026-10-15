export async function convertToBase64 (file:File):Promise<string>{
    let promise:string = await new Promise((r)=>{
        const reader = new FileReader();
        reader.onload = ()=> {
            let base64 = reader.result as string;
            r(base64);
        }
        reader.readAsDataURL(file);
    })
    return promise;
}