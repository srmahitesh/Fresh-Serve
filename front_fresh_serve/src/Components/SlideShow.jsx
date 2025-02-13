import styles from "./SlideShow.module.css"
const SlideShow = ()=>{
  return <div className={`${styles.slides}`}>
  

    <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-inner">
      <div className="carousel-item active" data-bs-interval="10000">
        <img src="https://raw.githubusercontent.com/srmahitesh/storage/refs/heads/main/slider1.webp" className="d-block w-90" alt="..."/>
      </div>
      <div className="carousel-item" data-bs-interval="2000">
        <img src="https://raw.githubusercontent.com/srmahitesh/storage/refs/heads/main/slider2.webp" className="d-block w-90" alt="..."/>
      </div>
      <div className="carousel-item">
        <img src="https://raw.githubusercontent.com/srmahitesh/storage/refs/heads/main/slider3.webp" className="d-block w-90" alt="..."/>
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>

  </div>
}

export default SlideShow;