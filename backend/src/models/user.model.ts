import { USER_ROLE, USER_STATUS } from './../constant/user.js';
import mongoose, { Document, Model, model, Schema } from 'mongoose';
import argon2 from 'argon2';

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    userRole: UserRole;
    userStatus: UserStatus;
    deletedAt?: Date | null;
    softDelete(): Promise<this>;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please fill a valid email',
            ],
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        userRole: {
            type: String,
            required: true,
            enum: {
                values: [USER_ROLE.CUSTOMER, USER_ROLE.ADMIN, USER_ROLE.CLIENT],
                message: 'Invalid user role given',
            },
            default: USER_ROLE.CUSTOMER,
        },
        userStatus: {
            type: String,
            required: true,
            enum: {
                values: [
                    USER_STATUS.APPROVED,
                    USER_STATUS.PENDING,
                    USER_STATUS.REJECTED,
                ],
                message: 'Invalid status for user given',
            },
            default: USER_STATUS.APPROVED,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre(/^find/, function (this: mongoose.Query<any, any>) {
    const options = this.getOptions();
    if (options.withDeleted === true) return;
    this.where({ deletedAt: null });
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    this.password = await argon2.hash(this.password);
});

userSchema.methods.verifyPassword = async function (
    plainPassword: string,
): Promise<boolean> {
    return await argon2.verify(this.password, plainPassword);
};

userSchema.methods.softDelete = async function (this: IUser): Promise<IUser> {
    this.deletedAt = new Date();
    return await this.save();
};

const UserModel: Model<IUser> = model<IUser>('User', userSchema);

export default UserModel;
