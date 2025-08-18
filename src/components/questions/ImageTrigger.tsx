import React, { useState, useRef } from "react";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { ImageOff, ImagePlus, Upload } from "lucide-react";
import styled from "styled-components";
import { Question } from "@/types/Question";
import { useQuestionContext } from "@/contexts/QuestionContext";
import { toast } from "sonner";

const QuestionImage = styled.img`
  border-radius: 1rem;
  max-height: 50vh;
  max-width: 80%;
`;

const QuestionImageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const ImagePreviewContainer = styled.div`
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
`;

const ImageErrorText = styled(Text)<{ $isVisible?: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const PreviewImage = styled(QuestionImage)<{ $isVisible?: boolean }>`
  display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
`;

interface ImageTriggerProps {
  question: Question;
}

export function ImageTrigger({ question }: ImageTriggerProps) {
  const [imageUrl, setImageUrl] = useState(question.imageUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateQuestion } = useQuestionContext();

  const uploadToImgur = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
          Authorization: "Client-ID 546c25a59c58ad7", // This is a public client ID for demos
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image to Imgur");
      }

      const data = await response.json();
      return data.data.link;
    } catch (error) {
      console.error("Imgur upload error:", error);
      throw error;
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    setIsUploading(true);
    try {
      toast.info("Uploading image...");
      const imgurUrl = await uploadToImgur(file);
      setImageUrl(imgurUrl);
      setImageError(false);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again if needed
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await updateQuestion(question.id, { imageUrl });
      toast.success("Image URL updated successfully!");
    } catch (error) {
      console.error("Error updating image URL:", error);
      toast.error("Failed to update image URL");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // Reset error state when URL changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageError(false);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {question.imageUrl ? (
          <QuestionImageButton>
            <QuestionImage src={question.imageUrl} alt="Question Image" />
          </QuestionImageButton>
        ) : (
          <Button variant="soft">
            <ImagePlus size={16} />
            Add Image
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit image</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Edit the image for this question.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Image URL
            </Text>
            <TextField.Root
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="Enter image URL"
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Upload Image
            </Text>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <Button
              variant="soft"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Upload size={16} />
                  Uploading...
                </>
              ) : (
                <>
                  <ImagePlus size={16} />
                  Upload
                </>
              )}
            </Button>
          </label>
          {imageUrl && (
            <div>
              <Text as="div" size="2" mb="1" weight="bold">
                Preview
              </Text>
              <ImagePreviewContainer>
                <PreviewImage
                  src={imageUrl}
                  alt="Image preview"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  $isVisible={!imageError}
                />
                <ImageErrorText size="2" color="red" $isVisible={imageError}>
                  <ImageOff size={16} />
                  Image not found or failed to load
                </ImageErrorText>
              </ImagePreviewContainer>
            </div>
          )}
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleSave} disabled={isSaving || isUploading}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
