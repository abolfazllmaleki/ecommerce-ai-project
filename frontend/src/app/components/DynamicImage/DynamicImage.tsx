import Image from 'next/image';

const DynamicImage = ({ imageUrl, altText }:any) => {
  return (
    <div className="w-full h-96 relative">
      <Image
        src={imageUrl}
        alt={altText}
        fill
        style={{ objectFit: 'contain' }}
        className="rounded-lg"
      />
    </div>
  );
};

export default DynamicImage;