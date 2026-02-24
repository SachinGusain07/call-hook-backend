import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

const uploadRoot = path.join(process.cwd(), 'uploads', 'payments');

fs.mkdirSync(uploadRoot, { recursive: true });

function sanitizeFilenamePart(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeExt = ext && ext.length <= 10 ? ext : '';

    const base = sanitizeFilenamePart(req.body?.email || req.body?.name || 'payment');
    const stamp = Date.now();
    const rand = Math.random().toString(16).slice(2);

    cb(null, `${base}-${stamp}-${rand}${safeExt}`);
  },
});

function fileFilter(_req, file, cb) {
  if (file?.mimetype?.startsWith('image/')) {
    cb(null, true);
    return;
  }

  cb(new Error('Only image files are allowed for screenshot upload'));
}

export const uploadPaymentScreenshot = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
