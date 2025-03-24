import { AdminGuard } from './admin-guard';
import { ApiDocsContent } from './api-docs-content';

export default function ApiDocsPage() {
  return (
    <AdminGuard>
      <ApiDocsContent />
    </AdminGuard>
  );
}
