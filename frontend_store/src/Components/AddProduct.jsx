import { useRef, useState } from "react";
import styles from "./AddProduct.module.css"
import { MdDocumentScanner } from "react-icons/md";

const AddProduct = ()=>{
    let [url, setUrl] = useState(``);
    let formData = useRef();
    let categories = [`DIARY`, `PACKING`, `CUTLERY`, `FRUITS`, `VEGETABLES`, `PACKEGED FOOD`, `GRAINS`, `PULSES`];
    let [adding, setAdding] = useState(false);



    const handleImage = async(event)=>{ //assuming it gonna work all time
        const file = event.target.files[0];
          console.log(file);
          if(!file){ //incase no image is really attached
            setUrl(``);
            return;
          }
          console.log(`image collected successfully`);
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "fresh_serve");
          data.append("cloud_name", "dqgsc4m4c");
          
          const result = await fetch("https://api.cloudinary.com/v1_1/dqgsc4m4c/image/upload",{
            method: "POST",
            body: data,
          });
          const uploadData = await result.json();
          setUrl(uploadData.url); //extracted url from meta data of rent upload
      }


      const handleFormData = async(event) => {
        event.preventDefault(); // Prevent form reload
      
        const formElement = formData.current; // Get form element
        const processedData = new FormData(formElement); // Create FormData object
      
        const formObject = Object.fromEntries(processedData.entries()); // Convert to JS object
      
        console.log("Form Data:", formObject);
        
        setAdding(true);
        const response = await fetch('http://localhost:8080/add_item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formObject),
        });
        if(response.ok){
          formData = "";
          setAdding(false);
          setUrl(``);
          alert(`Product Added Successfully`);
        }
        else{
          setAdding(false);
          alert(`Unable to Add Product, Please try Again`)
        }
      };
      



    return <>
    <center><h1>Add Product</h1></center>

    {(adding) ?    //conditional rendering of either form or 
    <div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Adding Product</span>
  </div>
</div> :
    <div className={styles.container}>
        <form ref={formData} onSubmit={handleFormData}>

            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Product Name:</label>
            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Amul Gold Milk" name="name" required/>
            </div>


            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Quantity:</label>
            <input type="text" className="form-control" id="exampleFormControlInput1" name="quantity" placeholder="1" required/>
            </div>
            

            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Brand Name:</label>
            <input type="text" className="form-control" id="exampleFormControlInput1" name="brand" placeholder="Amul" required/>
            </div>


            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Barcode Number:</label>
            <MdDocumentScanner style={{fontSize: "xx-large"}} onClick={()=>alert(`Barcode Scanner Not Detected`)}/><input type="text" className="form-control" id="exampleFormControlInput1" name="barcode_id" placeholder="123456789" required />
            <p>This helps us to itentifying the duplicate entry of products on the platform. Please Enter Carefully or prefer to Scan.</p>
            </div>

            

            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label" style={{marginRight: "40px"}}>Category:</label>
            <select name="category">
              <option value="" hidden></option>
            {categories.map(category =>{
                return <option value={category} key={category}>{category}</option>
            })}
            </select>
            </div>

            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Price:</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" name="price" placeholder="32" required/>
            </div>

            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">MRP:</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" name="mrp" placeholder="34" required/>
            </div>

            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Manufacturer:</label>
            <input type="text" className="form-control" id="exampleFormControlInput1" name="seller" placeholder="Gujarat Co-operative Milk Marketing Federation Ltd" required/>
            </div>

            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Keyword:</label>
            <input type="text" className="form-control" id="exampleFormControlInput1" name="keywords" placeholder="Milk" required/>
            </div>
            

            <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">Stock:</label>
            <input type="number" className="form-control" id="exampleFormControlInput1" name="stock" placeholder="500" required/>
            </div>
            {/* catergory: provide options from an array */}


            <div className="mb-3">
            <label htmlFor="formFile" className="form-label">Image:</label>
            <input className="form-control" type="file" id="formFile" accept="image/png, image/gif, image/jpeg, image/webp" onChange={handleImage} required/>
            </div>
            {url && <img src={url} alt="uploaded_image" height={120} width={120}/>}


            <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">Description</label>
            <textarea className="form-control" id="exampleFormControlTextarea1"  name="descrp" required/>
            </div>

            <input type="hidden" name="url" value={url}/>

            <button type="button" className="btn btn-success" onClick={handleFormData}>Add Item</button>
        </form>
    </div>
}
    </>
}

export default AddProduct;