import { closetApi } from "@/closetApi";
import { IProduct, ISize } from "@/interfaces";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";


interface FormData {
    _id?: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: string;
}




export const useSlug = ( product : IProduct) => {

    const router = useRouter();
    const [newTagValue, setNewTagValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm({
        defaultValues: product
    });

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'title') {
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", "")
                    .toLocaleLowerCase() || ""
                setValue('slug', newSlug)
            }
        })

        return () => subscription.unsubscribe()
    }, [watch, setValue])

    const onChangeSize = (size: ISize) => {
        const currentSizes = getValues('sizes');
        if (currentSizes.includes(size)) {
            return setValue('sizes', currentSizes.filter(s => s !== size), { shouldValidate: true });
        }
        setValue('sizes', [...currentSizes, size], { shouldValidate: true });

    }

    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();

        setNewTagValue('');

        const currentTags = getValues('tags');

        if (currentTags.includes(newTag)) {
            return;
        }
        currentTags.push(newTag);
    }

    const onDeleteTag = (tag: string) => {
        const updatedTags = getValues('tags').filter(t => t !== tag);
        setValue('tags', updatedTags, { shouldValidate: true })
    }

    const onFileSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {

        if (!target.files || target.files.length === 0) {
            return;
        }

        try {
            for (const file of target.files) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await closetApi.post<{ message: string }>('/admin/upload', formData);

                setValue('images', [...getValues('images'), data.message], { shouldValidate: true })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onDeleteImage = (image: string) => {
        setValue('images', getValues('images').filter(img => img !== image), { shouldValidate: true })
    }

    const onSubmitForm = async (form: FormData) => {
        if (form.images.length < 2) {
            return alert('Minimo 2 imagenes');
        }

        setIsSaving(true);

        try {
            await closetApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST',
                data: form,
            })

            if (!form._id) {
                router.replace(`/admin/products/${form.slug}`)
            } else {
                setIsSaving(false)
            }

        } catch (error) {
            console.log(error);
            setIsSaving(false);

        }
    }
    return {
        handleSubmit,
        onSubmitForm,
        onChangeSize,
        onDeleteImage,
        onDeleteTag,
        register,
        getValues,
        setValue,
        onNewTag,
        onFileSelected,
        setNewTagValue,
        newTagValue,
        isSaving,
        errors,
        fileInputRef,
        
    }

}
