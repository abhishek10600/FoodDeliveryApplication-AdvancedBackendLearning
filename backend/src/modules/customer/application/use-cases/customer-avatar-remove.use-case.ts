export interface CustomerAvatarRemoveUseCase {

  execute(input: {userId: string}): Promise<void>

}
