import { Link } from "react-router-dom";
import { postsOrdenados } from "../data/selectors";

export function BitacoraPage() {
  const items = postsOrdenados();

  return (
    <div className="page-content page-content--pad">
      <header className="page-header">
        <h1>Bitácora</h1>
      </header>

      <ul className="bita-feed" role="list">
        {items.map((post) => (
          <li key={post.id}>
            <article className="bita-feed__item">
              <Link to={`/bitacora/${post.id}`} className="bita-feed__link">
                <div className="bita-feed__cover">
                  <img
                    src={post.portada}
                    alt=""
                    width={800}
                    height={520}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="bita-feed__body">
                  {post.fecha ? (
                    <time dateTime={post.fecha}>{post.fecha}</time>
                  ) : null}
                  <h2>{post.titulo}</h2>
                  <p>{post.extracto}</p>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
