/**
 * Server-safe JSON-LD injector.
 * Usage: <JsonLd data={{ "@context": "https://schema.org", ... }} />
 */
export default function JsonLd({ data, id }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
