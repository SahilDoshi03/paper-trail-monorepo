import DocumentPreviewItem from "./DocumentPreviewItem";
import type { EditorDocument } from "@/lib/schemas/Document";
import { getDocuments } from "@/actions/Document";
import { auth } from "@/auth";

const DocumentsList = async () => {
  const session = await auth()
  if(!session?.user?.id){
    return 
  }
  const documents = await getDocuments(session?.user?.id);

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center p-10">
      <section className="w-full">
        <h2 className="text-xl font-bold mb-4">Start a new document</h2>
        <DocumentPreviewItem
          image="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png"
          title="Blank Document"
        />
      </section> 
      <section className="w-full">
        <h2 className="text-xl font-bold mb-4">Recent Documents</h2>
        {
          <div className="flex flex-wrap gap-4">
            {documents.map((item: EditorDocument) => (
              <DocumentPreviewItem
                key={item.id}
                docId={String(item.id)}
                image="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png"
                title={item.title}
              />
            ))}
          </div>
        }
      </section>
    </div>
  );
};

export default DocumentsList;
