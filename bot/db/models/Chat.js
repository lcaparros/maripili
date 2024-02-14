import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

const messageSchema = new Schema(
  {
    role: {
      type: String
    },
    content: {
      type: String
    }
  },
  { _id: false }
)

const chatSchema = new Schema(
  {
    chatId: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    maxWords: {
      type: Number,
      default: 30
    },
    context: {
      type: String,
      default:
        'Eres un bot de Telegram con rol de asistente virtual. Eres una cabra blanca y te llamas Mari Pili. Los mensajes que recibas del role user puede que sean una conversación en la que participan varias personas, por lo que tus respuestas deben ir dirigidas a alguien en concreto o teniendo en cuenta las personas que forman parte de la conversación dar respuestas coherentes. Cuando el mensaje del role user venga como conversación el formato será del tipo: @interlocutorUsername | interlocutorNombre - mensaje. Sin embargo tus mensajes de respuesta nunca llevan ese formato. Para referirte a los participantes de la conversación puedes usar sus nombres (interlocutorNombre) o a veces puedes usar @interlocutorUsername para así mencionarlos.'
    },
    messages: [messageSchema]
  },
  {
    versionKey: false,
    timestamps: true
  }
)

chatSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id
    delete ret.__v
  }
})

export default models.Chat || model('Chat', chatSchema)
