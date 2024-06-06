"use client";

import { useEffect, useRef, useState } from "react";
import * as ShopAR from "shopar-plugin/dist/shopar-plugin.js";
import Image from "next/image";
import { MaximizeIcon, MinimizeIcon } from "lucide-react";

export default function ShopARViewer({ modelSKU, thumbnail }) {
  const shopARElementRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const shopARPluginActions = useRef(null);

  useEffect(() => {
    if (shopARElementRef.current && modelSKU) {
      console.log("hi");
      const setupShopAR = async () => {
        const actions = await ShopAR.plugin.setup({
          apiKey: `${process.env.NEXT_PUBLIC_API_KEY_SHOPAR}`,
          sku: modelSKU,
          targetElement: shopARElementRef.current,
        });
        shopARPluginActions.current = { close: actions.close };
      };
      setupShopAR();
    }

    return () => {
      const cleanUpShopAR = async () => {
        await shopARPluginActions.current?.close?.();
      };
      try {
        cleanUpShopAR();
      } catch (error) {
        console.error(error);
      }
    };
  }, [modelSKU]);

  return (
    <div
      className={`bg-white ${
        isFullscreen ? "fixed inset-0 z-50" : "relative h-full w-full"
      }
      `}
    >
      <div className="absolute top-1 right-1 z-50">
        <button
          className="h-12 w-12 p-0 bg-white"
          onClick={() => setIsFullscreen((prev) => !prev)}
        >
          {!isFullscreen && <MaximizeIcon size={"24"} />}
          {isFullscreen && <MinimizeIcon size={"24"} />}
        </button>
      </div>
      <div
        id="shopAR"
        ref={shopARElementRef}
        className="w-full h-full flex justify-center relative inset-0"
      >
        {thumbnail !== null && (
          <Image
            className="object-cover self-center p-4 mb-12"
            src={thumbnail}
            alt={modelSKU}
            width={600}
            height={600}
            quality={100}
            priority={true}
          />
        )}
      </div>
    </div>
  );
}
