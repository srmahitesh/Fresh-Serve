import styles from "./Spinner.module.css"
const Spinner = ()=>{
  return <>
  
<div className={`d-flex justify-content-center ${styles.spinner}`}>
  <div className="spinner-border" role="status">
    <center className="visually-hidden">Loading...</center>
  </div>
</div>

  </>
}

export default Spinner;