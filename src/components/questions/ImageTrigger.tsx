import React, { useState } from "react";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { ImageOff, ImagePlus } from "lucide-react";
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
  const [imageError, setImageError] = useState(false);
  const { updateQuestion } = useQuestionContext();

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
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
