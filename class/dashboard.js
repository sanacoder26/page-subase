import supabase from "../config.js";

async function checkRole(params) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    alert("create your account");
    return (window.location.href = "../login.html");
  }
  try {
    const { data: profile, error } = await supabase
      .from("users")
      .select("role")
      .eq("userId", user.id)
      .single();
    console.log(profile);

    if (profile.role != "admin") {
      alert("access denied");
      return (window.location.href = "../profile.html");
    }
  } catch (err) {
    console.log(err);
  }
}

checkRole();

let colorsGroup = document.getElementById("colorsGroup");
let addColors = document.getElementById("addColors");
let _addProduct = document.getElementById('addProduct')
let pname = document.getElementById('pname')
let pprice = document.getElementById('pprice')
let pcategory = document.getElementById('pcategory')
let pdesc = document.getElementById('pdesc')
let pimage = document.getElementById('pimage')

addColors.addEventListener("click", () => {
  let div = document.createElement("div");
  div.innerHTML = ` <input type="color" name="" class="colorsInp" >
    <p  class="removeColor">X</p>

    `;
  colorsGroup.appendChild(div);

  div.querySelector(".removeColor").addEventListener("click", () => {
    div.remove();
  });
});
let imageUrl;
async function uploadFile(f) {
  try {
    let fileName = Date.now() + "-" + f.name;
    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, f);
    if (data) {
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(data.path);
      if (urlData) {
        imageUrl = urlData.publicUrl;
        return imageUrl
      } else {
        console.log("error in getting url");
      }
    }else{
        console.log('error in uploading');
        
    }
  } catch (error) {
    console.log(error);
  }
  
}

async function addProduct(e) {
    e.preventDefault()
   let colorsArr = []
   let colorsInp = document.querySelectorAll('.colorsInp')
   console.log(colorsInp);
   colorsInp.forEach(color=>{
      console.log(color.value);
      colorsArr.push(color.value.trim())
      
   })
   console.log(colorsArr);
   
    console.log(pimage.files[0]);
    let uploadFunc = await uploadFile(pimage.files[0])
    try {
        const { error } = await supabase
  .from('products')
  .insert({
    name: pname.value, 
    category: pcategory.value,
    price:pprice.value,
    desc:pdesc.value,
    colors:colorsArr,
    imgUrl:uploadFunc
})
if(error){
    console.log(error);
    
}else{
    console.log('added successfully');
    
}
    } catch (error) {
        
    }
    
}

_addProduct.addEventListener('submit',addProduct)

// function add (a){
//     let adding = a +10
//     return adding
// }

// let retCh = add(20)
// console.log(retCh);