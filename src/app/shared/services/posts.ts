export interface Posts {
    type: string;
    typeImage: string;
    postDate: Date;
    postText: string;
    postId: string;
    displayName: string;
    projectName: string;
    projectBanner: string;
    projectId: string;
    projectCategories: string;
    projectMembers: string;
    userPhotoURL: string;
    comments: [{ commentName: string, comment: string }];
    likes: number;
    uid: string;
}
