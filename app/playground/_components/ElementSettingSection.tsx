import { AlignRight, AlignLeft, AlignCenter, SwatchBook } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Value } from '@radix-ui/react-select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  selectedEl: HTMLElement,
  clearSelection: () => void;
}

function ElementSettingSection({ selectedEl, clearSelection }: Props) {
  const [classes, setClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");
  const [align, setAlign] = React.useState(selectedEl?.style?.textAlign);

  const applyStyle = (property: string, value: string) => {
    if (selectedEl) {
      selectedEl.style[property as any] = value;
    }
  };
  //Update alignment style when toggled
  React.useEffect(() => {
    if (selectedEl && align) {
      selectedEl.style.textAlign = align;
    }
  }, [align, selectedEl]);

  //Keep in sync if element classes are modifies elsewhere
  useEffect(() => {
    if (!selectedEl) {
      setClasses([]);
      return;
    }

    //set initial classes
    const currentClasses = String(selectedEl.className || "")
      .split(" ")
      .filter((c) => c.trim() !== "");
    setClasses(currentClasses);

    // watch for future class changes
    const observer = new MutationObserver(() => {
      const updated = String(selectedEl.className || "")
        .split(" ")
        .filter((c) => c.trim() !== "");
      setClasses(updated);
    });
    observer.observe(selectedEl, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [selectedEl]);

  //Remove a class
  const removeClass = (cls: string) => {
    const updated = classes.filter((c) => c !== cls);
    setClasses(updated);
    selectedEl.className = updated.join(" ");
  };

  //Add new class
  const addClass = () => {
    const trimmed = newClass.trim();
    if (!trimmed) return;
    if (!classes.includes(trimmed)) {
      const updated = [...classes, trimmed];
      setClasses(updated);
      selectedEl.className = updated.join(" ");
      
      // Trigger Tailwind to scan for new classes in iframe
      const iframeWindow = selectedEl.ownerDocument.defaultView;
      if (iframeWindow && (iframeWindow as any).tailwind) {
        (iframeWindow as any).tailwind.refresh();
      }
    }
    setNewClass("");
  };
  return (
    <div className='w-full lg:w-60 shadow p-3 sm:p-4 space-y-3 sm:space-y-4 h-auto lg:h-[90vh] rounded-xl mt-2 lg:mr-2 overflow-y-auto'>
      <h2 className='flex gap-2 items-center font-bold text-sm sm:text-base'><SwatchBook className="w-4 h-4 sm:w-5 sm:h-5" /> Settings</h2>
      {/* Font Size + Text Color inline */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
        <div className='flex-1 w-full'>
          <label className='text-xs sm:text-sm block mb-1 text-foreground'>Font Size</label>

          <Select defaultValue={selectedEl?.style?.fontSize || '24px'}
            onValueChange={(value) => applyStyle('fontSize', value)}
          >
            <SelectTrigger className="w-full text-xs sm:text-sm">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(53)].map((item, index) => (
                <SelectItem value={index + 12 + 'px'} key={index}>{index + 12}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className='text-xs sm:text-sm block mb-1 text-foreground'>Text Color</label>
        <input type="color" className='w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] rounded border'
          onChange={(event) => applyStyle('color', event.target.value)}
        />
      </div>

      {/* Text Alignment */}
      <div>
        <label className='text-xs sm:text-sm block mb-1 text-foreground'>Text Alignment</label>
        <ToggleGroup
          type="single"
          value={align}
          onValueChange={setAlign}
          className='bg-gray-100 dark:bg-gray-800 rounded-lg p-1 inline-flex w-full justify-between'
        >
          <ToggleGroupItem value="left" className='p-1.5 sm:p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex-1'>
            <AlignLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" className='p-1.5 sm:p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex-1'>
            <AlignCenter className="w-4 h-4 sm:w-5 sm:h-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" className='p-1.5 sm:p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex-1'>
            <AlignRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Background Color + Border Radius inline */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
        <div>
          <label className='text-xs sm:text-sm block mb-1 text-foreground'>Background</label>
          <Input
          type='color'
          className='w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] rounded-lg'
          defaultValue={selectedEl?.style.backgroundColor || '#ffffff'}
          onChange={(event) => applyStyle('backgroundColor', event.target.value)}
          />
        </div>
        <div className="flex-1 w-full sm:w-auto">
          <label className='text-xs sm:text-sm block mb-1 text-foreground'>Border Radius</label>
          <Input
          type='text'
          placeholder='e.g. 8px'
          defaultValue={selectedEl?.style?.borderRadius || ''}
          onChange={(e) => applyStyle('borderRadius', e.target.value)}
          className='text-xs sm:text-sm'
          />
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className='text-xs sm:text-sm block mb-1 text-foreground'>Padding</label>
        <Input
        type='text'
        placeholder='e.g. 10px 15px'
        defaultValue={selectedEl?.style?.padding || '' }
        onChange={(e) => applyStyle('padding', e.target.value)}
        className='text-xs sm:text-sm'
        />
      </div>

      {/* Margin */}
      <div>
        <label className='text-xs sm:text-sm block mb-1 text-foreground'>Margin</label>
        <Input
        type='text'
        placeholder='e.g. 10px 15px'
        defaultValue={selectedEl?.style?.margin || ''}
        onChange={(e) => applyStyle('margin', e.target.value)}
        className='text-xs sm:text-sm'
        />
      </div>

      {/* Class Manager */}
      <div>
        <label className='text-xs sm:text-sm font-medium block mb-1 text-foreground'>Classes</label>
         
         {/* Existing Classes as removable chips */}
         <div className='flex flex-wrap gap-1.5 sm:gap-2 mt-2'>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <span
                  key={cls}
                  className='flex text-xs items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100 border text-gray-900'
                  >
                    {cls}
                    <button
                      onClick={() => removeClass(cls)}
                      className='ml-1 text-red-500 hover:text-red-700 text-sm'
                    >
                      ×
                    </button>
                  </span>
                ))
              ): (
                <span className='text-gray-400 dark:text-gray-500 text-xs sm:text-sm'>No classes applied</span>
              )}
         </div>

         {/* Add new class input */}
         <div className='flex gap-2 mt-2 sm:mt-3'>
          <Input 
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Add class..."
            className='text-xs sm:text-sm'
          />
          <Button type='button' onClick={addClass} size="sm" className="sm:size-default text-xs sm:text-sm">
            Add
          </Button>
         </div>
      </div>
    </div>
  )
}

export default ElementSettingSection