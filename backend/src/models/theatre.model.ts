import { model, Schema, Document, Model } from 'mongoose';

export interface ITheatre extends Document {
    name: string;
    description: string;
    city: string;
    address: string;
    pincode: string;
    state: string;
    status: 'ACTIVE' | 'INACTIVE';
    movies: Schema.Types.ObjectId[];
}

const theatreSchema = new Schema<ITheatre>(
    {
        name: {
            type: String,
            required: [true, 'Theatre name is required'],
            trim: true,
            minlength: [2, 'Theatre name must be at least 2 characters'],
            maxlength: [150, 'Theatre name cannot exceed 150 characters'],
        },

        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: [10, 'Description must be at least 10 characters'],
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },

        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
            maxlength: [500, 'Address cannot exceed 500 characters'],
        },

        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
            maxlength: [100, 'City cannot exceed 100 characters'],
        },

        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
            maxlength: [100, 'State cannot exceed 100 characters'],
        },

        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^\d{6}$/, 'Pincode must be 6 digits'],
        },

        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
        },

        movies: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
        },
    },
    {
        timestamps: true,
    },
);

theatreSchema.index({
    city: 1,
    status: 1,
});

const TheatreModel: Model<ITheatre> = model<ITheatre>('Theatre', theatreSchema);

export default TheatreModel;
