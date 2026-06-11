import { Link, useParams } from "react-router-dom";
import { getPostById } from "../data/selectors";
import { useContent } from "../context/ContentContext";
import { plainTextToSafeHtml } from "../utils/plainText";
import { toEmbedUrl } from "../utils/embedVideo";

export function BitacoraPostPage() {
  const { posts } = useContent();
  const { id } = useParams<{ id: string }>();
  const post = id ? getPostById(posts, id) : undefined;
  const imagenes = (post?.imagenes ?? []).filter((s) => s.trim() !== "");

  if (!post) {
    return (
      <div className="page-content page-content--pad">
        <Link to="/bitacora">Bitácora</Link>
      </div>
    );
  }

  return (
    <article className="page-content page-content--pad editorial">
      <nav className="breadcrumb" aria-label="Migas">
        <Link to="/bitacora">Bitácora</Link>
        <span aria-hidden> / </span>
        <span>{post.titulo}</span>
      </nav>
      <header className="editorial__head">
        {post.fecha ? (
          <time className="editorial__time" dateTime={post.fecha}>
            {post.fecha}
          </time>
        ) : null}
        <h1>{post.titulo}</h1>
        <p className="editorial__extract">{post.extracto}</p>
      </header>

      {post.videoUrl ? (
        <div className="editorial__video">
          <iframe
            src={toEmbedUrl(post.videoUrl)}
            title="Vídeo embebido"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="editorial__layout">
        <div
          className="editorial__body"
          dangerouslySetInnerHTML={{
            __html: plainTextToSafeHtml(post.cuerpo),
          }}
        />
        {imagenes.length > 0 ? (
          <aside className="editorial__gallery" aria-label="Imágenes de la entrada">
            {imagenes.map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                alt={`${post.titulo} — imagen ${i + 1}`}
                loading="lazy"
              />
            ))}
          </aside>
        ) : null}
      </div>
    </article>
  );
}
