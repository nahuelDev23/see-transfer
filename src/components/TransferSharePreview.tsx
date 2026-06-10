interface TransferSharePreviewProps {
  title: string;
  imageUrl: string;
}

export default function TransferSharePreview({
  title,
  imageUrl,
}: TransferSharePreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
      <p className="border-b border-slate-800 px-4 py-2 text-xs font-medium uppercase tracking-widest text-slate-500">
        Vista previa al compartir
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={title}
        className="aspect-[1200/630] w-full object-cover"
      />
    </div>
  );
}
