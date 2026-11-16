import { upload } from '@vercel/blob/client';

window.uploadPaymentProof = (file, orderId) => {
  const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
  return upload(`payment-proofs/${orderId}/proof.${extension}`, file, {
    access: 'private',
    contentType: file.type,
    handleUploadUrl: `/api/orders/${encodeURIComponent(orderId)}/proof-upload`,
    clientPayload: orderId,
    multipart: false,
  });
};
