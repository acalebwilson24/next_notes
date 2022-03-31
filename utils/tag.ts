import { TagAPIResponse } from "../redux/types";

export function filterTags(allTags: TagAPIResponse[], currentTags: string[], newTag: string) {
    const filteredTags = allTags
        // remove tags that are already in the list
        .filter(tag => !currentTags.some(t => t == tag.tag))
        // filter to only tags that match the tag search
        .filter(tag => tag.tag.toLowerCase().includes(newTag.toLowerCase()))
        .sort((a, b) => a.count < b.count ? 1 : -1)
        .slice(0, 10);
    return filteredTags;
}