import { Link } from 'react-router-dom';
import images from '../utils/images';

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer">
        <p className="about-us">Our Websites 🌏</p>
        <div className="useful-links">
          <Link className="web-link" to="https://www.facebook.com/eleesaknust/"><img src={images.facebook} alt="facebook" /></Link>
          <Link className="web-link" to="https://twitter.com/knust_eleesa"><img src={images.twitter} alt="twitter" /></Link>
          <Link className="web-link" to="https://www.linkedin.com/company/eleesa-knust/"><img src={images.linkedin} alt="linkedin" /></Link>
          <Link className="web-link" to="https://www.youtube.com/@eleesaknust"><img src={images.youtube} alt="youtube" /></Link>
        </div>
        <div className="other-links">
          <div className="email">
            <img src={images.email} alt="email" />
            <p>eleesaofficial@gmail.com</p>
          </div>
          <div className="ig">
            <img src={images.ig} alt="ig" />
            <p>@eleesaofficial</p>
          </div>
        </div>
      </div>
      <p className="copy-rights">© CopyRights ELEESA 2023</p>
    </div>
  );
}
