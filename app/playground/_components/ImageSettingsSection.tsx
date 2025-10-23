"use client";
import React, { useRef, useState } from "react";
import {
  Image as ImageIcon,
  Crop,
  Expand,
  Image as ImageUpscale, // no lucide-react upscale, using Image icon
  ImageMinus,
  Loader2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageKit from "imagekit";

type Props = {
  selectedEL: HTMLImageElement;
};

const transformOptions = [
  { label: "Smart Crop", value: "smartcrop", icon: <Crop />, transformation: 'fo-auto' },
  { label: "Resize", value: "resize", icon: <Expand />, transformation: 'e-dropshadow' },
  { label: "Upscale", value: "upscale", icon: <ImageUpscale />, transformation: 'e-upscale' },
  { label: "BG Remove", value: "bgremove", icon: <ImageMinus />, transformation: 'e-removedotbg' },
];

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
});

function ImageSettingSection({ selectedEL }: Props) {
  const [altText, setAltText] = useState(selectedEL.alt || "");
  const [width, setWidth] = useState<number>(selectedEL.width || 300);
  const [height, setHeight] = useState<number>(selectedEL.height || 200);
  const [selectedImage, setSelectedImage] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [borderRadius, setBorderRadius] = useState(
    selectedEL.style.borderRadius || "0px"
  );
  const [preview, setPreview] = useState(selectedEL.src || "");
  const [activeTransforms, setActiveTransforms] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Toggle transform
  const toggleTransform = (value: string) => {
    setActiveTransforms((prev) =>
      prev.includes(value)
        ? prev.filter((t) => t !== value)
        : [...prev, value]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUploadedFile = async () => {
    if (selectedImage) {
      setLoading(true);
      const imageRef = await imagekit.upload({
        //@ts-ignore
        file: selectedImage,
        fileName: Date.now() + ".png",
        isPublished: true
      })
    
      //@ts-ignore
      selectedEL.setAttribute('src', imageRef?.url + "?tr=")
      setLoading(false);
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const GenerateAiImage = () => {
    setLoading(true);

    const url = `https://ik.imagekit.io/drewcool/ik-genimg-prompt-${altText}/${Date.now()}.png?tr=`

    setPreview(url);
    selectedEL.setAttribute('src', url)
  }

  const ApplyTransformation = (trValue: string) => {
    setLoading(true);

    if (!preview.includes(trValue)) {
      const url = preview + trValue + ','
      setPreview(url);
      selectedEL.setAttribute('src', url)
    }else{
      const url = preview.replaceAll(trValue+",","");
      setPreview(url);
      selectedEL.setAttribute('src', url)
    }

    
  }

  return (
    <div className="w-full lg:w-60 shadow p-3 sm:p-4 space-y-3 sm:space-y-4 h-auto lg:h-[90vh] rounded-xl mt-2 lg:mr-2 overflow-y-auto">
      <h2 className="flex gap-2 items-center font-bold text-sm sm:text-base">
        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Image Settings
      </h2>

      {/* Preview (clickable) */}
      <div className="flex justify-center">
        <img
          src={preview}
          alt={altText}
          className="max-h-32 sm:max-h-40 object-contain border rounded cursor-pointer hover:opacity-80"
          onClick={openFileDialog}
          onLoad={() => setLoading(false)}
          //Loading off if error throws
          // onError={() => setLoading(false)}
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full text-xs sm:text-sm"
        onClick={saveUploadedFile}
        disabled={loading}
        size="sm"
      >
        {loading && <Loader2Icon className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />}Upload Image
      </Button>

      {/* Alt text */}
      <div>
        <label className="text-xs sm:text-sm block mb-1">Prompt</label>
        <Input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Enter alt text"
          className="text-xs sm:text-sm"
        />
      </div>

      <Button className="w-full text-xs sm:text-sm" onClick={GenerateAiImage} disabled={loading} size="sm">
        {loading && <Loader2Icon className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />} Generate AI Image
      </Button>

      {/* Transform Buttons */}
      <div>
        <label className="text-xs sm:text-sm mb-1 block">AI Transform</label>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          <TooltipProvider>
            {transformOptions.map((opt) => {
              const applied = activeTransforms.includes(opt.value);
              return (
                <Tooltip key={opt.value}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={preview.includes(opt.transformation) ? 'default' : "outline"}
                      className="flex items-center justify-center p-1.5 sm:p-2"
                      onClick={() => ApplyTransformation(opt.transformation)}
                      size="sm"
                    >
                      <span className="w-4 h-4 sm:w-5 sm:h-5">{opt.icon}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {opt.label} {applied && "(Applied)"}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>

      {/* Conditional Resize Inputs */}
      {activeTransforms.includes("resize") && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs sm:text-sm block mb-1">Width</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="text-xs sm:text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs sm:text-sm block mb-1">Height</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="text-xs sm:text-sm"
            />
          </div>
        </div>
      )}

      {/* Border Radius */}
      <div>
        <label className="text-xs sm:text-sm block mb-1">Border Radius</label>
        <Input
          type="text"
          value={borderRadius}
          onChange={(e) => setBorderRadius(e.target.value)}
          placeholder="e.g. 8px or 50%"
          className="text-xs sm:text-sm"
        />
      </div>
    </div>
  );
}

export default ImageSettingSection;

